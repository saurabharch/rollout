upstream pushgeek.com {
        ip_hash;
        server localhost:5500;
        server localhost:5501;
}
limit_req_zone $binary_remote_addr zone=perip:10m rate=1r/s;
limit_req_zone $server_name zone=perserver:10m rate=10r/s;

include mime.types;

server_tokens off;
#geoip_country /etc/nginx/geoip/GeoIP/GeoLite2-Country/GeoLite2-Country.mmdb;
#geoip_city /etc/nginx/geoip/GeoLiteCity/GeoLite2-City/GeoLite2-City.mmdb;


server {
    if ($host = pushgeek.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen       80;
        listen       [::]:80;
        server_name  pushgeek.com;
        return 301 https://$host$request_uri;
		limit_req zone=perip burst=5 nodelay;
		limit_req zone=perserver burst=10;
    

}

server {
        listen [::]:443 ssl http2 ipv6only=on;
        listen 443 ssl http2;
        gzip on;
        server_name  pushgeek.com,13.232.1.81;
        root         /home/ubuntu/rollout;
        

 # HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
        add_header Strict-Transport-Security "max-age=15768000" always;

#Cross Origin Scripting and Protection for click jacking		
#	add_header X-Frame-Options "SAMEORIGIN";
#	add_header X-XSS-Protection "1; mode=block";

# Enable SSL sessions
	ssl_session_cache shared:SSL:40m;
	ssl_session_timeout 4h;
	ssl_session_tickets on;

        resolver 8.8.8.8;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;	
        location / {
            proxy_http_version 1.1;
	    
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_pass "https://pushgeek.com/";
        }
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    
    ssl_certificate /etc/letsencrypt/live/pushgeek.com-0001/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/pushgeek.com-0001/privkey.pem; # managed by Certbot
}

