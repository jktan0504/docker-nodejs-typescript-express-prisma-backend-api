FROM postgres:latest

# Remove ADD init.sql line  

# Create config directory
RUN mkdir -p /docker-entrypoint-initdb.d

# Add init scripts 
ADD init.sql /docker-entrypoint-initdb.d/ 

# Increase MD5 auth via env var 
ENV POSTGRES_HOST_AUTH_METHOD=md5

# Expose ports 
EXPOSE 5432  

# Add data volume 
VOLUME /var/lib/postgresql/data

# Run Postgres
CMD ["postgres"] 