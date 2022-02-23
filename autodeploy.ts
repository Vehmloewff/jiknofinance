const shouldInit = Deno.args[0] === 'init'

interface Config {
	preDeploy?: string
	droplet: string
	static: {
		dir: string
		domain: string
	}
	server: {
		dir: string
		domain: string
	}
}

const configText = await Deno.readTextFile('autodeploy.json')
if (!configText) throw new Error('Could not find config in the root of project')

const config = (await JSON.parse(configText)) as Config

const caddyfile = `
${config.server.domain} {
	reverse_proxy localhost:8080
}

${config.static.domain} {
	root * /root/static
	file_server
}

`

const serviceFile = `

[Service]
ExecStart="/root/.deno/bin/deno run -A --unstable https://denopkg.com/Vehmloewff/autobase@1.1.3/cli/main.ts run /root/server"
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target

`

const initCode = `
# install deno
ssh root@${config.droplet} "curl -fsSL https://deno.land/install.sh | sh"
ssh root@${config.droplet} "echo 'export PATH="/root/.deno/bin:\\$PATH"' >> .bashrc"

# install caddy and start it
ssh root@${config.droplet} "sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
	sudo apt update
	sudo apt install caddy
	echo '${caddyfile}' > /etc/caddy/Caddyfile
	systemctl start caddy
	systemctl enable caddy"

# create a service and start it
ssh root@${config.droplet} "echo '${serviceFile}' > /etc/systemd/system/server.service"
ssh root@${config.droplet} "systemctl start server"
ssh root@${config.droplet} "systemctl enable server"

# reload anything that has changed
ssh root@${config.droplet} "systemctl daemon-reload"
`

const reloadCode = `
ssh root@${config.droplet} "systemctl restart server"
`

const command = `
rsync -avzh ${config.static.dir} root@${config.droplet}:static
rsync -avzh ${config.server.dir} root@${config.droplet}:server

${shouldInit ? initCode : reloadCode}
`

await Deno.run({ cmd: ['sh', '-c', command] }).status()
