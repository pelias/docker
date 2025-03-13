import pandas as pd
import pyproj

# Definiere das Projektionssystem für GK2 (EPSG:31466)
gk2 = pyproj.CRS("EPSG:31466")

# Definiere das Projektionssystem für WGS84 (EPSG:4326)
wgs84 = pyproj.CRS("EPSG:4326")

# Erstelle einen Transformer, der die Koordinaten von GK2 zu WGS84 konvertiert
transformer = pyproj.Transformer.from_crs(gk2, wgs84, always_xy=True)

# Funktion zur Umwandlung von GK2-Koordinaten (x, y) in WGS84 (Breite, Länge)
def gk2_to_wgs84(x, y):
    # Umwandlung in WGS84
    longitude, latitude = transformer.transform(x, y)
    return latitude, longitude  # Reihenfolge: (Breite, Länge)

# Funktion zum Verarbeiten der TSV-Datei und Ausgabe als CSV mit Pandas
def process_tsv(input_file, output_file):
    # Lese die TSV-Datei in einen Pandas DataFrame
    df = pd.read_csv(input_file, sep='\t')

    # Umwandlung der Koordinaten
    df['H_lat'], df['H_lon'] = zip(*df.apply(lambda row: gk2_to_wgs84(row['H_KOORX'], row['H_KOORY']), axis=1))
    df["source"] = "csv_haltstellen"
    df["layer"] = "venue"
    df.drop(columns=["H_ART","H_REFOBJEKT","H_ORT","H_PROVGEM","H_PROVORT","H_VERBUNDNR","H_KOORX","H_KOORY","H_BETRIEB","H_HSTKENNUNG","H_UMSKENNUNG","H_UMSQUALI","H_UMSZEIT","H_KUERZEL","H_EINRICHTUNG","H_ASTKENNUNG","H_ASTGEBIET","H_ASTNR","H_ASTBEREICH","H_INSUSER","H_INSDATE","H_MODUSER","H_MODDATE","H_ZUGANGBARFREI","H_BARKLASSE","H_ASTOBJEKT","H_ZUGANGBARGRAD","H_ANZSUCHANFR","H_INESKENNUNG","H_STEIG","H_KENN_KURZSTRECKE"], inplace=True)

    # Speichern der umgewandelten Koordinaten in einer CSV-Datei
    df.to_csv(output_file, index=False)

# Beispielaufruf
input_file = './data/csv-import/haltestellen_raw.csv'  # Pfad zur Eingabedatei (TSV)
output_file = './data/csv-import/haltestellen_ready.csv'  # Pfad zur Ausgabedatei (CSV)

process_tsv(input_file, output_file)
print(f"Die Koordinaten wurden erfolgreich umgewandelt und in '{output_file}' gespeichert.")
