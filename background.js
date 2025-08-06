const {exec} = require('child_process');
const files = require('fs');

const cfg=JSON.parse(files.readFileSync('safe.json'));
const safeNetworks=cfg.safe;

function check() {
    exec('netsh wlan show interfaces', (error,stdout) => {
        if(error){
            document.getElementById('wifi').innerText = "Error while checking WiFi network";
        return;
    }

    const match = stdout.match(/^\s*SSID\s*:\s*(.+)$/m)
    const id = match ? match[1].trim() : "unknown";

    document.getElementById('wifi').innerText=`Connected to: ${id}`;
    if(!safeNetworks.includes(id))
    {
        document.getElementById('vpn').innerText= `Unsafe WiFi Network. Starting VPN`;
        start();
    }
    else
    {
        document.getElementById('vpn').innerText = `Safe WiFi Network`;
    }
});
}

function start(){
    const vpn = exec('openvpn --config "C:\\VPN\\vpn.ovpn"');

  vpn.stdout.on('data', (data) => {
    const line = data.toString();
    console.log(`[VPN] ${line}`);

    if (line.includes('Initialization Sequence Completed')) {
      document.getElementById('vpn').innerText = `VPN Connection Succesful`;
    }
  });
}

function manual()
{
    start();
}

function stop() {
  const display = document.getElementById('vpn');

  exec('taskkill /F /IM openvpn.exe', (err, stdout, stderr) => {
    if (err) {
      console.error("Failed", err.message);
      display.innerText = "Error";
      return;
    }

    console.log("Process terminated.");
    display.innerText = "Disconnected";
  });
}

check();

