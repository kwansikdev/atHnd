/** base64를 ArrayBuffer로 변환하는 함수 */
export function base64ToBuffer(base64Text: string) {
	const origin = base64Text.replace(/(data:.+,)/g, '')
	const arraybuffer = Uint8Array.from(atob(origin), (c) => c.charCodeAt(0))
	return arraybuffer
}
