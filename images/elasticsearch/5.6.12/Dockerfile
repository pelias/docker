# see: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

# base image
FROM docker.elastic.co/elasticsearch/elasticsearch:5.6.12
USER root

# environmental settings
ENV ES_JAVA_OPTS '-Xms512m -Xmx512m'
ENV cluster.name 'pelias-dev'
ENV discovery.type 'single-node'
ENV bootstrap.memory_lock 'true'
RUN echo 'vm.max_map_count=262144' >> /etc/sysctl.conf

# disable xpack
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin remove x-pack --purge

# configure plugins
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install analysis-icu
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install repository-s3

# elasticsearch config
ADD elasticsearch.yml /usr/share/elasticsearch/config/
RUN chown elasticsearch:elasticsearch config/elasticsearch.yml

## set permissions so any user can run elasticsearch
# add read permissions to all files in dir
RUN chmod go+r /usr/share/elasticsearch -R
# add write permissions to config dir
RUN chmod go+w /usr/share/elasticsearch \
    /usr/share/elasticsearch/config
# add list permissions to directorys
RUN chmod go+x /usr/share/elasticsearch \
    /usr/share/elasticsearch/config \
	/usr/share/elasticsearch/config/ingest-geoip \
	/usr/share/elasticsearch/config/repository-s3
# add execute permissions to bins
RUN chmod go+x /usr/share/elasticsearch/bin/*

# run as elasticsearch user
USER elasticsearch
