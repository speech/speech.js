DNS
===

Each jsdns site has three main DNS entries, one for the HTTP server, another for the CouchDB API server, and a third for
meta sites, such as errors and a blog.

Add `A`/`AAAA` records pointing `jsdns.tld` (i.e. your domain) to an HTTP server IP and a CNAME `*.jsdns.tld` pointing
to `jsdns.tld`.

Add `A`/`AAAA` records pointing `api.www.jsdns.tld` to your CoucDB instance.  Currently, however, speech.is is hardcoded
 in as the API server.  PR's are warmly welcomed.

Add `A`/`AAAA` records pointing `error.www.jsdns.tld` to your generic web server.  Currently, error handling is broken.
Again, PR requests are warmly welcomed.

Server Configs
==============

##Apache
TODO: Test this config!

```
<VirtualHost *:80>
    DocumentRoot /path/to/your/host
    ServerName yourdomain.com
    DirectoryIndex index.html

   RewriteEngine On
   RewriteRule (.*) /index.html [PT]

    <Directory "/path/to/your/host">
      Require all granted
    </Directory>
</VirtualHost>
```

##NGINX

TODO: Test this config!
```
location / {
    rewrite ^ /base.html break;
}
```
