export default function() {
  async function toBase64(file: File): Promise<string> {
    const arrayBuffer = await fileToArrayBuffer(file) as ArrayBuffer
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
    return base64
  }

  function fileToArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file)
    })
  }

  return { toBase64 }
}