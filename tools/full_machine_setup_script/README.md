
# Full Pelias machine setup script with pelias/docker

This script is aimed at performing a full install of a Pelias server instance from A to Z, with a single script launch.

What this script does chronologically:
* Installs base dependencies
* Configures nginx to forward incoming 443 (https) requests to port localhost:4000
* Creates a dedicated pelias user on the machine, configured to be usable with docker
* Then run the following actions from the pelias user:
  * Download the docker repo for pelias
  * Configure the "planet" project to have all ports only accessible from localhost (4000, 4100, 4200, 4300, 4400, 9200, 9300)
  * Run the pelias commands one by one to get the service fully operational with the planet project

## How to use this script

* Modify the following line in `pelias_setup_main_as_root.sh`:
    ```
    export SERVER_DOMAIN_NAME="write.your.domain.here"
    ```
* Copy the following files to your server:
  * `pelias_setup_main_as_root.sh`
  * `pelias_setup_user_level_part.sh`
* Login to your server as root, and cd to the directory where those files have been copied
* Open a screen with the `screen` command
* Run the main script:
    ```
    sh pelias_setup_main_as_root.sh
    ```
* Wait a few days for the script to complete: depending on your machine, it could be 2 days, 14 days or more...
* Make an example query (replacing "your.server.ip"): `https://your.server.ip/v1/search?text=portland` (modified example from [here](https://github.com/pelias/docker#make-an-example-query))

## How to follow the progress of the script

Running the script will generate the following logs file (you can create separate screens to follow the progress):
* `./logs_pelias_setup.txt` (root user level logs)
* `/home/pelias/logs_pelias_setup.txt` (pelias user level logs)
* `/home/pelias/logs_pelias_setup_setup_details_for_pull.txt` (pelias user level logs for pull)
* `/home/pelias/logs_pelias_setup_setup_details_for_es_start.txt` (pelias user level logs for es start)
* `/home/pelias/logs_pelias_setup_setup_details_for_es_wait.txt` (pelias user level logs for es wait)
* `/home/pelias/logs_pelias_setup_setup_details_for_es_create.txt` (pelias user level logs for es create)
* `/home/pelias/logs_pelias_setup_setup_details_for_download.txt` (pelias user level logs for download)
* `/home/pelias/logs_pelias_setup_setup_details_for_prepare.txt` (pelias user level logs for prepare)
* `/home/pelias/logs_pelias_setup_setup_details_for_import.txt` (pelias user level logs for import)
* `/home/pelias/logs_pelias_setup_setup_details_for_compose_up.txt` (pelias user level logs for compose up)

## An example of how the script runs

This script was tested on an Ubuntu 18.04 server from March 25th to April 8th 2019.

Server specs:
* 8 cores CPU: Intel(R) Xeon(R) CPU W3520 @ 2.67GHz
* 32GB of RAM
* 2TB of regular HDD (not SSD)

Running the script gave this output for `./logs_pelias_setup.txt`:
```
Mon Mar 25 22:17:26 UTC 2019 - Step 1: install base dependencies
Mon Mar 25 22:18:50 UTC 2019 - Step 2: configure nginx to redirect incoming https traffic to localhost:4000
Mon Mar 25 22:18:50 UTC 2019 - Step 3: dedicated user creation
Mon Mar 25 22:18:51 UTC 2019 - Step 4: pelias full setup as the user
Sun Apr  7 14:04:47 UTC 2019 - Setup completed with success!!!
```

And it gave this output for `/home/pelias/logs_pelias_setup.txt`:
```
Mon Mar 25 22:18:51 UTC 2019 - User level setup - start
Mon Mar 25 22:18:52 UTC 2019 - User level setup - compose file configuration
Mon Mar 25 22:18:52 UTC 2019 - User level setup - compose pull
Mon Mar 25 22:25:27 UTC 2019 - User level setup - elastic start
Mon Mar 25 22:25:36 UTC 2019 - User level setup - elastic wait
Mon Mar 25 22:25:44 UTC 2019 - User level setup - elastic create
Mon Mar 25 22:25:51 UTC 2019 - User level setup - download all
Tue Mar 26 00:27:07 UTC 2019 - User level setup - prepare all
Thu Apr  4 11:39:58 UTC 2019 - User level setup - import all
Sun Apr  7 14:03:46 UTC 2019 - User level setup - compose up
Sun Apr  7 14:04:44 UTC 2019 - User level setup - Setup completed with success!!!
```
