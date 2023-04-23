## Mitigate DDoS attack with ngx_http_limit_req_module and fail2ban

The fail2ban do have comprehensive collection of scripts that scan log files and ban IPs that match malicious activities. But we are going to look on how to use ngx_http_limit_req_module logs to ban IPs that shows sign of Distributed Denial of Service (DDoS) attack on your website.

It is assumed in this tutorial that Nginx server is installed in your server. The following procedures are tested on my aws server running Ubuntu 16 64-bit Linux distribution.

1. Enable ngx_http_limit_req_module by adding the following script in your Nginx configuration:

```shell
http {
  limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
  ...
  server {
    ...
    limit_req zone=one burst=5;
  }
}
```

2. Restart Nginx server:

```shell
systemctl restart  nginx.service
```

You will see entry something like this in Nginx error log if there's abuse detected:

```shell
 2021/08/27 02:18:05 [error] 21235#21235: *326 limiting requests, excess: 5.297 by zone "one", client: 91.214.169.44, server: www.rollout.com, request: "GET /node/8 HTTP/1.1", host: "www.rollout.com", referrer: "https://www.rollout.com/archive/202102"
```
We will use this sample log entry for our fail2ban filter script.

3. Install fail2ban:

```shell
sudo apt-get install fail2ban
```

4. Create fail2ban filter script based on the Nginx error log entry:

```shell
vi /etc/fail2ban/filter.d/nginx-ddos.conf
```

5. The content of this filter file:

```shell 
[Definition]
failregex = limiting requests, excess:.* by zone.*client: 
ignoreregex = 
```

6. We will use the /etc/hosts.deny to block the IP of the DDoS attacker so we will need to create new fail2ban action script:

```shell
vi /etc/fail2ban/action.d/hostsdeny.conf
```

7. Add the following script as its content:

```shell
[Definition]
actionstart = 
actionstop = 
actioncheck = 
actionban = IP= &&
            printf %%b ": $IP\n" >> 
actionunban = IP= && sed -i.old /ALL:\ $IP/d 

[Init]
file = /etc/hosts.deny
daemon_list = ALL
```

8. Enable the newly created fail2ban filter:

```shell
vi /etc/fail2ban/jail.local
```

9. Append the following script:

```shell
[nginx-ddos]
enabled = true
port    = http,https
banaction = hostsdeny
findtime = 120
bantime  = 7200
maxretry = 30
logpath = %(nginx_error_log)s
```

10. Start the fail2ban service:

```shell
systemctl start fail2ban
systemctl enable fail2ban.service
systemctl list-unit-files | grep fail2ban
```

11. To check the status of this fail2ban filter:

```shell
fail2ban-client status nginx-ddos
```

You will see something like this:

```shell

Status for the jail: nginx-ddos
|- Filter
|  |- Currently failed: 18
|  |- Total failed:     770
|  `- File list:        /var/log/nginx/nginx_error_log
`- Actions
   |- Currently banned: 1
   |- Total banned:     8
   `- Banned IP list:   291.24.69.144

```

12. To test if the fail2ban nginx-ddos filter working:

```shell
fail2ban-regex /var/log/nginx/nginx_error_log /etc/fail2ban/filter.d/nginx-ddos.conf
```

13. You can use apache-bench to test the whole system:

```shell
ab -n 20 -c 10 http://www.rollout.com
```

14. Execute the following command to monitor the fail2ban log:

```shell
watch -n 1 tail -n 20 /var/log/fail2ban.log
```

And you will something like this while testing with apache-bench:

```shell

2021-02-29 09:56:45,535 fail2ban.filter         [16931]: INFO    [nginx-ddos] Found 92.29.183.76
2021-02-29 09:56:45,536 fail2ban.filter         [16931]: INFO    [nginx-ddos] Found 92.29.183.76
2021-02-29 09:56:45,537 fail2ban.filter         [16931]: INFO    [nginx-ddos] Found 92.29.183.76
2021-02-29 09:56:45,538 fail2ban.filter         [16931]: INFO    [nginx-ddos] Found 92.29.183.76

```
