Packages required for leafii_delta:
<ul style="list-style-type:disc">
	<li>dfischer:prerenderio from meteor</li>
	<li>prerender-node from npm</li>
</ul>

Prerender server: https://github.com/prerender/prerender

Add these lines to ~/.bash_profile to forward Leafolio IP to internal IP
<pre style="text-indent: 5em;">
	#Change dst. ip of packets sent to 208.75.74.227 to 10.1.56.6
	sudo iptables -t nat -A OUTPUT -d 208.75.74.227 -j DNAT --to-destination 10.1.5$
	#Change src. ip of packets sent from 10.1.56.6 to 208.75.74.227
	sudo iptables -t nat -A INPUT -s 10.1.56.6 -j SNAT --to-source 208.75.74.227
</pre>
