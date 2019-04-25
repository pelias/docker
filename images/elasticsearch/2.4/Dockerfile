# base image
FROM elasticsearch:2.4

# configure plugins
RUN /usr/share/elasticsearch/bin/plugin install analysis-icu
RUN /usr/share/elasticsearch/bin/plugin install cloud-aws

# elasticsearch config
ADD elasticsearch.yml /usr/share/elasticsearch/config/
RUN chown elasticsearch:elasticsearch config/elasticsearch.yml
