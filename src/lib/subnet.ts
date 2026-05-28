export interface SubnetResult {
  ip: string
  cidr: number
  subnetMask: string
  wildcardMask: string
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalAddresses: number
  usableHosts: number
  ipClass: string
  isPrivate: boolean
  ipBinary: string
  maskBinary: string
  networkBinary: string
  broadcastBinary: string
  ipHex: string
  networkHex: string
  maskHex: string
}

export function parseIP(ip: string): number[] {
  return ip.split('.').map(Number)
}

export function octetsToInt(octets: number[]): number {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
}

export function intToOctets(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]
}

export function intToIP(n: number): string {
  return intToOctets(n).join('.')
}

export function cidrToMask(cidr: number): number {
  if (cidr === 0) return 0
  return (0xffffffff << (32 - cidr)) >>> 0
}

export function toBinaryString(n: number): string {
  return n.toString(2).padStart(32, '0')
}

export function intToHex(n: number): string {
  return '0x' + n.toString(16).toUpperCase().padStart(8, '0')
}

export function formatBinary(n: number): string {
  const b = toBinaryString(n)
  return `${b.slice(0, 8)}.${b.slice(8, 16)}.${b.slice(16, 24)}.${b.slice(24)}`
}

export function getIPClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D (Multicast)'
  return 'E (Reserved)'
}

// RFC 1918 private ranges:
// 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
export function isPrivateIP(ipInt: number): boolean {
  const o = intToOctets(ipInt)
  if (o[0] === 10) return true
  if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return true
  if (o[0] === 192 && o[1] === 168) return true
  return false
}

export function validateIP(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(p => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255)
}

export function validateCIDR(cidr: number): boolean {
  return Number.isInteger(cidr) && cidr >= 0 && cidr <= 32
}

export function parseCIDRNotation(input: string): { ip: string; cidr: number } | null {
  const match = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/)
  if (!match) return null
  const ip = match[1]
  const cidr = parseInt(match[2], 10)
  if (!validateIP(ip) || !validateCIDR(cidr)) return null
  return { ip, cidr }
}

export function isIPInSubnet(ip: string, networkAddress: string, broadcastAddress: string): boolean {
  if (!validateIP(ip)) return false
  const ipInt = octetsToInt(parseIP(ip))
  const netInt = octetsToInt(parseIP(networkAddress))
  const bcastInt = octetsToInt(parseIP(broadcastAddress))
  return ipInt >= netInt && ipInt <= bcastInt
}

export function getAdjacentCIDRs(
  networkAddress: string,
  cidr: number,
): { prev: string | null; next: string | null } {
  if (cidr === 0) return { prev: null, next: null }
  const netInt = octetsToInt(parseIP(networkAddress))
  const subnetSize = Math.pow(2, 32 - cidr)
  const maskInt = cidrToMask(cidr)
  const wildcardInt = (~maskInt) >>> 0
  const bcastInt = (netInt | wildcardInt) >>> 0

  const prev = netInt >= subnetSize ? `${intToIP((netInt - subnetSize) >>> 0)}/${cidr}` : null
  const next = bcastInt < 0xffffffff ? `${intToIP((bcastInt + 1) >>> 0)}/${cidr}` : null
  return { prev, next }
}

export function splitSubnet(
  networkAddress: string,
  cidr: number,
  targetCidr: number,
): string[] {
  if (targetCidr <= cidr || targetCidr > 32) return []
  const count = Math.pow(2, targetCidr - cidr)
  const subnetSize = Math.pow(2, 32 - targetCidr)
  const results: string[] = []
  let cur = octetsToInt(parseIP(networkAddress))
  const limit = Math.min(count, 512)
  for (let i = 0; i < limit; i++) {
    results.push(`${intToIP(cur)}/${targetCidr}`)
    cur = (cur + subnetSize) >>> 0
  }
  return results
}

export function formatReport(result: SubnetResult): string {
  const scope = result.isPrivate ? 'Private (RFC 1918)' : 'Public'
  const lines = [
    `Subnet Report: ${result.networkAddress}/${result.cidr}`,
    '='.repeat(40),
    `Network Address : ${result.networkAddress}`,
    `Broadcast       : ${result.broadcastAddress}`,
    `Subnet Mask     : ${result.subnetMask}`,
    `Wildcard Mask   : ${result.wildcardMask}`,
    `First Host      : ${result.firstHost}`,
    `Last Host       : ${result.lastHost}`,
    `Total Addresses : ${result.totalAddresses.toLocaleString()}`,
    `Usable Hosts    : ${result.usableHosts.toLocaleString()}`,
    `CIDR Notation   : /${result.cidr}`,
    `IP Class        : ${result.ipClass}`,
    `Scope           : ${scope}`,
    `IP Hex          : ${result.ipHex}`,
    `Network Hex     : ${result.networkHex}`,
    `Mask Hex        : ${result.maskHex}`,
    '',
    'Binary:',
    `  IP Address  : ${result.ipBinary}`,
    `  Subnet Mask : ${result.maskBinary}`,
    `  Network     : ${result.networkBinary}`,
    `  Broadcast   : ${result.broadcastBinary}`,
  ]
  return lines.join('\n')
}

export function calculate(ip: string, cidr: number): SubnetResult {
  if (!validateIP(ip)) throw new Error(`Invalid IP address: ${ip}`)
  if (!validateCIDR(cidr)) throw new Error(`Invalid CIDR prefix: ${cidr}`)

  const octets = parseIP(ip)
  const ipInt = octetsToInt(octets)
  const maskInt = cidrToMask(cidr)
  const wildcardInt = (~maskInt) >>> 0
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  // /31 RFC 3021: point-to-point, both addresses usable, no broadcast concept
  // /32: single host
  let totalAddresses: number
  let usableHosts: number
  let firstHostInt: number
  let lastHostInt: number

  if (cidr === 32) {
    totalAddresses = 1
    usableHosts = 1
    firstHostInt = networkInt
    lastHostInt = networkInt
  } else if (cidr === 31) {
    totalAddresses = 2
    usableHosts = 2
    firstHostInt = networkInt
    lastHostInt = broadcastInt
  } else {
    totalAddresses = Math.pow(2, 32 - cidr)
    usableHosts = totalAddresses - 2
    firstHostInt = (networkInt + 1) >>> 0
    lastHostInt = (broadcastInt - 1) >>> 0
  }

  return {
    ip,
    cidr,
    subnetMask: intToIP(maskInt),
    wildcardMask: intToIP(wildcardInt),
    networkAddress: intToIP(networkInt),
    broadcastAddress: intToIP(broadcastInt),
    firstHost: intToIP(firstHostInt),
    lastHost: intToIP(lastHostInt),
    totalAddresses,
    usableHosts,
    ipClass: getIPClass(octets[0]),
    isPrivate: isPrivateIP(ipInt),
    ipBinary: formatBinary(ipInt),
    maskBinary: formatBinary(maskInt),
    networkBinary: formatBinary(networkInt),
    broadcastBinary: formatBinary(broadcastInt),
    ipHex: intToHex(ipInt),
    networkHex: intToHex(networkInt),
    maskHex: intToHex(maskInt),
  }
}
