/** HTML 문자열에서 문자열만 추출하는 함수 */
export function htmlToText(html: string) {
	return html.replace(/(<([^>]+)>)/gi, '')
}
