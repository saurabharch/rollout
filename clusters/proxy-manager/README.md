#### Before Running this docker-compose 

Make sure your port 80,81,443 is available 

### Windows Command
Display current TCP/IP network connections and protocol statistics.

Syntax
   NETSTAT [options] [-p protocol] [interval]

Key
   -a   Display All connections and listening ports.
   -e   Display Ethernet statistics. (may be combined with -s)
   -n   Display addresses and port numbers in Numerical form.
   -r   Display the Routing table.
   -o   Display the Owning process ID associated with each connection.

   -b   Display the exe involved in creating each connection or listening port.*
   -v   Verbose - use in conjunction with -b, to display the sequence of
        components involved for all executables.

   -p protocol
        Show only connections for the protocol specified; 
        can be any of: TCP, UDP, TCPv6 or UDPv6.  
        If used with the -s option then the following protocols
        can also be specified: IP, IPv6, ICMP,or ICMPv6. 

   -s   Display per-protocol statistics.  By default, statistics are
        shown for IP, IPv6, ICMP, ICMPv6, TCP, TCPv6, UDP, and UDPv6;
        (The v6 protocols are not available under 2k and NT4)
        The -p option can be used to display just a subset of these.

   interval     Redisplay statistics, pausing interval seconds between
                each display. (default=once only) Press CTRL+C to stop

## Commands
```shell
netstat -np <protocol> | find "port #"
```

### Example

In CMD/ BASH

```shell
netstat -na | find "80"
```

In Poweshell

```shell
netstat -na | Select-String "80"
```

[More Click here](https://stackoverflow.com/questions/12010631/command-line-for-looking-at-specific-port)

## Note:

If PID kill is not working successful try another command for close all net service with this

```shell
net stop http
```


Deploy the Proxy Manager stack

```shell
docker-compose up -d
```

[Visit](http://localhost:81) http://localhost:81

Default 🧑‍🏫Admin User:

Email:    admin@example.com
Password: changeme

⚠️First Login to Dashboard and change the email id and password for the administrar User.