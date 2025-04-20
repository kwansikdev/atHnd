/** 파일을 base64로 변환하는 함수 */
export function fileToBase64(
	file: File,
	callback: (result: string | ArrayBuffer | null) => void
) {
	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = () => {
		callback(reader.result)
	}
}
