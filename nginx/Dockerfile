# Use the official nginx image
FROM nginx:latest  

# set timezone data
ENV TZ=Asia/Kuala_Lumpur

# Copy our default nginx config
COPY config/nginx.conf /etc/nginx/nginx.conf

# Delete the default nginx config 
RUN rm -v /etc/nginx/conf.d/default.conf

# COPY CERTS
RUN mkdir /etc/nginx/certs
COPY certs/* /etc/nginx/certs

# Expose port 80 443
EXPOSE 80 443

# Start nginx 
CMD ["nginx", "-g", "daemon off;"]