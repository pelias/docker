#!/bin/bash

# Logdatei setzen
LOGFILE="logfile.txt"

# Terminal-Sitzung in die Logdatei schreiben
exec > >(tee -a $LOGFILE) 2>&1

# Maximale Anzahl der Versuche
MAX_RETRIES=3

# Standardmäßig werden alle Schritte ausgeführt
SKIP_DOWNLOAD=true
SKIP_PREPARE=false
SKIP_IMPORT=false

# Fehlerbehandlungsfunktion
handle_error() {
    local error_message="Fehler: $1"
    echo "$error_message"

    # E-Mail senden über msmtp
    {
        echo "From: no-reply@druckplanet24.de"
        echo "To: admin@druckplanet24.de"
        echo "Subject: Fehler im Pelias Setup"
        echo
        echo "$error_message"
        echo
        echo "Logfile-Inhalt:"
        tail -n 50 "$LOGFILE"
    } | msmtp admin@druckplanet24.de

    exit 1
}

# Sicheres Ausführen von Befehlen mit Wiederholungslogik
safe_execute() {
    echo "Ausführen: $1"
    local command=$1
    local retries=0

    until [ $retries -ge $MAX_RETRIES ]
    do
        eval $command
        if [ $? -eq 0 ]; then
            echo "$command abgeschlossen"
            return 0
        fi

        output=$(eval $command 2>&1)
        if echo "$output" | grep -q "no such service"; then
            echo "Dienst existiert nicht, überspringe: $command"
            return 0
        fi

        retries=$((retries+1))
        echo "Fehler beim Ausführen von: $command. Versuch $retries von $MAX_RETRIES."
    done

    handle_error "$command nach $MAX_RETRIES Versuchen fehlgeschlagen"
}

# Syntaxprüfung
echo "Starte Syntaxprüfung..."

# Überprüfen der .env-Datei
if [ -f ".env" ]; then
    if grep -Eq '^[^#]*=.*$' .env; then
        echo ".env Syntax ist korrekt."
    else
        handle_error ".env hat einen Syntaxfehler."
    fi
else
    handle_error ".env Datei existiert nicht."
fi

# Überprüfen der docker-compose.yml-Datei
if [ -f "docker-compose.yml" ]; then
    docker-compose config -q || handle_error "docker-compose.yml hat einen Syntaxfehler."
    echo "docker-compose.yml Syntax ist korrekt."
else
    handle_error "docker-compose.yml Datei existiert nicht."
fi

# Überprüfen der pelias.json-Datei
if [ -f "pelias.json" ]; then
    jq empty pelias.json || handle_error "pelias.json hat einen Syntaxfehler."
    echo "pelias.json Syntax ist korrekt."
else
    handle_error "pelias.json Datei existiert nicht."
fi

# Überprüfen, ob Pelias Docker läuft
if docker ps | grep -q "pelias"; then
    echo "Pelias Docker läuft, beende ihn..."
    pelias compose down || handle_error "pelias compose down"
else
    echo "Pelias Docker läuft nicht."
fi

# Pelias-Befehle ausführen
safe_execute "pelias compose pull"
safe_execute "pelias elastic start"
safe_execute "pelias elastic wait"

# Reset-Abfrage vor pelias elastic create
read -t 10 -p "Möchten Sie Elasticsearch zurücksetzen? (Standard: Nein) [ja/Nein]: " reset_choice
reset_choice=${reset_choice:-nein}
if [[ "$reset_choice" =~ ^[Jj]a$ ]]; then
    echo "Zurücksetzen von Elasticsearch..."
    pelias elastic drop || handle_error "pelias elastic drop"
else
    echo "Kein Zurücksetzen von Elasticsearch durchgeführt."
fi

# Elasticsearch Index erstellen, wenn er nicht bereits existiert
create_output=$(pelias elastic create 2>&1)
if echo "$create_output" | grep -q "resource_already_exists_exception"; then
    echo "Index existiert bereits, weiter mit dem nächsten Schritt."
elif echo "$create_output" | grep -q "acknowledged"; then
    echo "Index erfolgreich erstellt, weiter mit dem nächsten Schritt."
else
    handle_error "pelias elastic create: $create_output"
fi

# Download-Schritt (optional überspringen)
if [ "$SKIP_DOWNLOAD" = "false" ]; then
    safe_execute "pelias download all"
else
    echo "Pelias Download-Schritt wird übersprungen."
fi

# Vorbereitungsschritte und Valhalla-Tiles erstellen (optional überspringen)
if [ "$SKIP_PREPARE" = "false" ]; then
    safe_execute "mkdir -p data/valhalla"
    safe_execute "docker run --rm -it \
      --network shared-net \
      --user 1000:1000 \
      -v '/nfs-data/docker/appdata/pelias/germany/data/valhalla:/data/valhalla' \
      -v '/nfs-data/docker/appdata/pelias/germany/data/openstreetmap:/data/openstreetmap' \
      -v '/nfs-data/docker/appdata/pelias/germany/data/polylines:/data/polylines' \
      pelias/valhalla_baseimage \
      /bin/bash -c \"./scripts/build_tiles.sh && \
                      find /data/valhalla/valhalla_tiles | sort -n | tar cf /data/valhalla/valhalla_tiles.tar --no-recursion -T - && \
                      ./scripts/export_edges.sh\""
    safe_execute "pelias prepare interpolation"
    safe_execute "pelias prepare placeholder"
else
    echo "Vorbereitungsschritte und Valhalla-Tiles-Erstellung werden übersprungen."
fi

# Daten importieren (optional überspringen)
if [ "$SKIP_IMPORT" = "false" ]; then
    safe_execute "pelias import all"
else
    echo "Datenimport wird übersprungen."
fi

# Pelias-Dienste starten
safe_execute "pelias compose up"
