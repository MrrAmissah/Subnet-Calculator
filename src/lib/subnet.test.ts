import { describe, it, expect } from 'vitest'
import {
  parseIP,
  octetsToInt,
  intToIP,
  cidrToMask,
  formatBinary,
  getIPClass,
  isPrivateIP,
  validateIP,
  validateCIDR,
  parseCIDRNotation,
  calculate,
} from './subnet'

describe('parseIP', () => {
  it('splits IPv4 into four octets', () => {
    expect(parseIP('192.168.1.0')).toEqual([192, 168, 1, 0])
    expect(parseIP('0.0.0.0')).toEqual([0, 0, 0, 0])
    expect(parseIP('255.255.255.255')).toEqual([255, 255, 255, 255])
  })
})

describe('octetsToInt / intToIP', () => {
  it('round-trips correctly', () => {
    const cases = ['192.168.1.1', '0.0.0.0', '255.255.255.255', '10.0.0.1', '172.31.255.1']
    cases.forEach(ip => expect(intToIP(octetsToInt(parseIP(ip)))).toBe(ip))
  })
})

describe('cidrToMask', () => {
  it('produces correct subnet masks', () => {
    expect(intToIP(cidrToMask(0))).toBe('0.0.0.0')
    expect(intToIP(cidrToMask(8))).toBe('255.0.0.0')
    expect(intToIP(cidrToMask(16))).toBe('255.255.0.0')
    expect(intToIP(cidrToMask(24))).toBe('255.255.255.0')
    expect(intToIP(cidrToMask(28))).toBe('255.255.255.240')
    expect(intToIP(cidrToMask(32))).toBe('255.255.255.255')
  })
})

describe('formatBinary', () => {
  it('formats 32-bit int with octet dots', () => {
    expect(formatBinary(0)).toBe('00000000.00000000.00000000.00000000')
    expect(formatBinary(0xffffffff)).toBe('11111111.11111111.11111111.11111111')
    expect(formatBinary(octetsToInt([192, 168, 1, 0]))).toBe('11000000.10101000.00000001.00000000')
  })
})

describe('getIPClass', () => {
  it('identifies all classes', () => {
    expect(getIPClass(0)).toBe('A')
    expect(getIPClass(127)).toBe('A')
    expect(getIPClass(128)).toBe('B')
    expect(getIPClass(191)).toBe('B')
    expect(getIPClass(192)).toBe('C')
    expect(getIPClass(223)).toBe('C')
    expect(getIPClass(224)).toBe('D (Multicast)')
    expect(getIPClass(239)).toBe('D (Multicast)')
    expect(getIPClass(240)).toBe('E (Reserved)')
    expect(getIPClass(255)).toBe('E (Reserved)')
  })
})

describe('isPrivateIP', () => {
  it('detects RFC 1918 private ranges', () => {
    expect(isPrivateIP(octetsToInt([10, 0, 0, 1]))).toBe(true)
    expect(isPrivateIP(octetsToInt([10, 255, 255, 255]))).toBe(true)
    expect(isPrivateIP(octetsToInt([172, 16, 0, 1]))).toBe(true)
    expect(isPrivateIP(octetsToInt([172, 31, 255, 254]))).toBe(true)
    expect(isPrivateIP(octetsToInt([192, 168, 0, 1]))).toBe(true)
    expect(isPrivateIP(octetsToInt([192, 168, 255, 255]))).toBe(true)
  })

  it('treats public IPs as not private', () => {
    expect(isPrivateIP(octetsToInt([8, 8, 8, 8]))).toBe(false)
    expect(isPrivateIP(octetsToInt([1, 1, 1, 1]))).toBe(false)
    expect(isPrivateIP(octetsToInt([172, 15, 0, 1]))).toBe(false)
    expect(isPrivateIP(octetsToInt([172, 32, 0, 1]))).toBe(false)
  })
})

describe('validateIP', () => {
  it('accepts valid addresses', () => {
    expect(validateIP('0.0.0.0')).toBe(true)
    expect(validateIP('255.255.255.255')).toBe(true)
    expect(validateIP('192.168.1.1')).toBe(true)
  })

  it('rejects bad addresses', () => {
    expect(validateIP('256.0.0.1')).toBe(false)
    expect(validateIP('192.168.0')).toBe(false)
    expect(validateIP('192.168.0.1.5')).toBe(false)
    expect(validateIP('abc.def.ghi.jkl')).toBe(false)
    expect(validateIP('')).toBe(false)
    expect(validateIP('192.168.0.-1')).toBe(false)
  })
})

describe('validateCIDR', () => {
  it('accepts 0–32', () => {
    expect(validateCIDR(0)).toBe(true)
    expect(validateCIDR(24)).toBe(true)
    expect(validateCIDR(32)).toBe(true)
  })

  it('rejects out-of-range or non-integer', () => {
    expect(validateCIDR(-1)).toBe(false)
    expect(validateCIDR(33)).toBe(false)
    expect(validateCIDR(1.5)).toBe(false)
  })
})

describe('parseCIDRNotation', () => {
  it('parses valid CIDR strings', () => {
    expect(parseCIDRNotation('192.168.1.0/24')).toEqual({ ip: '192.168.1.0', cidr: 24 })
    expect(parseCIDRNotation('10.0.0.0/8')).toEqual({ ip: '10.0.0.0', cidr: 8 })
  })

  it('returns null for invalid input', () => {
    expect(parseCIDRNotation('192.168.1.0')).toBeNull()
    expect(parseCIDRNotation('999.0.0.0/24')).toBeNull()
    expect(parseCIDRNotation('192.168.1.0/33')).toBeNull()
    expect(parseCIDRNotation('')).toBeNull()
  })
})

describe('calculate — normal cases', () => {
  it('/24 network', () => {
    const r = calculate('192.168.1.100', 24)
    expect(r.networkAddress).toBe('192.168.1.0')
    expect(r.broadcastAddress).toBe('192.168.1.255')
    expect(r.subnetMask).toBe('255.255.255.0')
    expect(r.wildcardMask).toBe('0.0.0.255')
    expect(r.firstHost).toBe('192.168.1.1')
    expect(r.lastHost).toBe('192.168.1.254')
    expect(r.totalAddresses).toBe(256)
    expect(r.usableHosts).toBe(254)
    expect(r.ipClass).toBe('C')
    expect(r.isPrivate).toBe(true)
  })

  it('/16 network', () => {
    const r = calculate('172.16.50.1', 16)
    expect(r.networkAddress).toBe('172.16.0.0')
    expect(r.broadcastAddress).toBe('172.16.255.255')
    expect(r.usableHosts).toBe(65534)
    expect(r.isPrivate).toBe(true)
  })

  it('/8 network', () => {
    const r = calculate('10.1.2.3', 8)
    expect(r.networkAddress).toBe('10.0.0.0')
    expect(r.broadcastAddress).toBe('10.255.255.255')
    expect(r.usableHosts).toBe(16777214)
  })

  it('/0 covers all addresses', () => {
    const r = calculate('1.2.3.4', 0)
    expect(r.networkAddress).toBe('0.0.0.0')
    expect(r.broadcastAddress).toBe('255.255.255.255')
    expect(r.subnetMask).toBe('0.0.0.0')
    expect(r.wildcardMask).toBe('255.255.255.255')
    expect(r.totalAddresses).toBe(4294967296)
    expect(r.usableHosts).toBe(4294967294)
  })

  it('public IP is not private', () => {
    const r = calculate('8.8.8.8', 32)
    expect(r.isPrivate).toBe(false)
  })
})

describe('calculate — boundary CIDR values', () => {
  it('/31 RFC 3021: both addresses usable', () => {
    const r = calculate('192.168.1.10', 31)
    expect(r.networkAddress).toBe('192.168.1.10')
    expect(r.broadcastAddress).toBe('192.168.1.11')
    expect(r.firstHost).toBe('192.168.1.10')
    expect(r.lastHost).toBe('192.168.1.11')
    expect(r.totalAddresses).toBe(2)
    expect(r.usableHosts).toBe(2)
  })

  it('/32 single host', () => {
    const r = calculate('10.1.2.3', 32)
    expect(r.networkAddress).toBe('10.1.2.3')
    expect(r.broadcastAddress).toBe('10.1.2.3')
    expect(r.firstHost).toBe('10.1.2.3')
    expect(r.lastHost).toBe('10.1.2.3')
    expect(r.totalAddresses).toBe(1)
    expect(r.usableHosts).toBe(1)
    expect(r.subnetMask).toBe('255.255.255.255')
    expect(r.wildcardMask).toBe('0.0.0.0')
  })
})

describe('calculate — boundary octets', () => {
  it('handles 0.0.0.0/0', () => {
    const r = calculate('0.0.0.0', 0)
    expect(r.networkAddress).toBe('0.0.0.0')
  })

  it('handles 255.255.255.255/32', () => {
    const r = calculate('255.255.255.255', 32)
    expect(r.networkAddress).toBe('255.255.255.255')
  })
})

describe('calculate — invalid input', () => {
  it('throws on bad IP', () => {
    expect(() => calculate('999.0.0.1', 24)).toThrow('Invalid IP')
    expect(() => calculate('not.an.ip', 24)).toThrow('Invalid IP')
  })

  it('throws on bad CIDR', () => {
    expect(() => calculate('10.0.0.0', -1)).toThrow('Invalid CIDR')
    expect(() => calculate('10.0.0.0', 33)).toThrow('Invalid CIDR')
  })
})
