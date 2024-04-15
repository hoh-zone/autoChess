export function bytesArrayToU64(uint8Array: number[]) {
  const arrayBuffer = new Uint8Array(uint8Array).buffer
  const dataView = new DataView(arrayBuffer)
  const uint64 = dataView.getBigUint64(0, true)
  return Number(uint64).valueOf()
}

export function bytesArrayToString(input: number[]) {
  const bytes = new Uint8Array(input)
  const decoder = new TextDecoder("utf-8")
  const res = decoder.decode(bytes)
  return res
}

export function bytesArrayToHex(u8Array: number[]) {
  let hexString = ""
  for (let i = 0; i < u8Array.length; i++) {
    const hex = u8Array[i].toString(16).padStart(2, "0")
    hexString += hex
  }
  return hexString
}
