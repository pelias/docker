# Notes

Random notes taken during the service setup

## Architecture

- <https://github.com/pelias/interpolation/issues/284#issuecomment-986102336>

## How-To

- use csv-importer <https://github.com/pelias/csv-importer?tab=readme-ov-file#address>

## Troubleshooting

- <https://github.com/pelias/docker/issues/342>
- If recently ingested data isn't appearing, verify if data isn't paginated
- When search text param is too short, pelias remove the `address` layer from
  results and it mostly kills all possible useful result.

The following csv samples where successful in importing data:

Venue layer:

- <http://10.1.8.106:4000/v1/search?text=pintinho>

```csv
id,name,source,layer,lat,lon
1,JFK Airport XY,custom,venue,40.639,-73.778
2,pintinho martins airport,custom,venue,-3.779,-38.541
```

Address layer with extra data (addendum):

- <http://10.1.8.106:4000/v1/search?text=haywards&layers=address>

```csv
id,source,layer,name,zipcode,lat,lon,addendum_json_markerr
0065239790629cfc9f819b6bbb988eaa,test-markerr-properties,address,1226 Haywards Heath Ln,27502,35.7416,-78.86781,"{""msa_id"":39580,""msa"":""Raleigh, NC"",""full_address"":""7305 Cape Charles Dr, Raleigh NC 27617-7646"",""city"":""Raleigh"",""state"":""NC""}"
```

Address layer (current big query export format)

- <http://10.1.8.106:4000/v1/search?layers=address&text=13800%20County%20Road%201560>

```csv
id,source,layer,lat,lon,name,number,street,city,zipcode
024c063d0515a66633c25356bafca000,markerr-properties,address,34.75284,-96.70867,"13800 County Road 1560, Ada OK 74820-9205",13800,County Road 1560,Ada,74820
```
