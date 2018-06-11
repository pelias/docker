# see: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

# base image
FROM docker.elastic.co/elasticsearch/elasticsearch:5.2.1
USER root

# environmental settings
ENV ES_JAVA_OPTS '-Xms512m -Xmx512m'
ENV xpack.security.enabled 'false'
ENV xpack.monitoring.enabled 'false'
ENV cluster.name 'pelias-dev'
ENV bootstrap.memory_lock 'true'
RUN echo 'vm.max_map_count=262144' >> /etc/sysctl.conf

# configure plugins
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install analysis-icu

# elasticsearch config
ADD elasticsearch.yml /usr/share/elasticsearch/config/
RUN chown elasticsearch:elasticsearch config/elasticsearch.yml

# run as elasticsearch user
USER elasticsearch
