import { networkInterfaces } from "os";

export function listNetworkInterfaceAddresses(): string[] {
	const addresses = [];
	const interfaces = networkInterfaces();

	for(const name of Object.keys(interfaces)) {
		const networks = interfaces[name];
		if(networks) {
			for(const network of networks) {
				const ipv4Family = typeof network.family === "string" ? "IPv4" : 4;
				if(network.family === ipv4Family && !network.internal) { addresses.push(network.address); }
			}
		}
	}

	return addresses;
}