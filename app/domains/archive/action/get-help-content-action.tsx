// 도움말 내용 가져오기
export const getHelpContentAction = (topic: string) => {
  switch (topic) {
    case "basic":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">기본 정보 입력 도움말</h2>
          <p>
            피규어의 기본 정보를 입력하는 단계입니다. 다음 필드들을 채워주세요:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>피규어 이름 (한글)</strong>: 피규어의 공식 한글 이름을
              입력하세요.
            </li>
            <li>
              <strong>캐릭터</strong>: 피규어가 나타내는 캐릭터의 이름을
              입력하세요.
            </li>
            <li>
              <strong>제조사</strong>: 피규어를 제작한 회사를 선택하세요.
            </li>
            <li>
              <strong>작품</strong>: 캐릭터가 등장하는 작품을 선택하세요.
            </li>
            <li>
              <strong>카테고리</strong>: 피규어의 종류를 선택하세요 (스케일,
              넨드로이드 등).
            </li>
            <li>
              <strong>출시일</strong>: 피규어의 출시일을 선택하세요.
            </li>
            <li>
              <strong>가격</strong>: 피규어의 정가를 입력하세요.
            </li>
          </ul>
          <p>별표(*)가 표시된 필드는 필수 입력 항목입니다.</p>
        </div>
      );
    case "details":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">상세 정보 입력 도움말</h2>
          <p>
            피규어의 상세 정보를 입력하는 단계입니다. 다음 필드들을 채워주세요:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>피규어 이름 (일본어/영어)</strong>: 피규어의 공식
              일본어/영어 이름을 입력하세요.
            </li>
            <li>
              <strong>원형사</strong>: 피규어 원형을 제작한 사람의 이름을
              입력하세요. 여러 명인 경우 쉼표로 구분하세요.
            </li>
            <li>
              <strong>도색</strong>: 피규어 도색을 담당한 사람의 이름을
              입력하세요. 여러 명인 경우 쉼표로 구분하세요.
            </li>
            <li>
              <strong>스케일</strong>: 피규어의 스케일을 입력하세요 (예: 1/7).
            </li>
            <li>
              <strong>크기</strong>: 피규어의 크기를 입력하세요 (예: 약 230mm).
            </li>
            <li>
              <strong>재질</strong>: 피규어의 재질을 입력하세요 (예: PVC, ABS).
            </li>
            <li>
              <strong>한정판</strong>: 한정 생산 피규어인 경우 체크하세요.
            </li>
            <li>
              <strong>성인용</strong>: 성인용 피규어인 경우 체크하세요.
            </li>
          </ul>
          <p>이 단계의 모든 필드는 선택 입력 항목입니다.</p>
        </div>
      );
    case "images":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">이미지 업로드 도움말</h2>
          <p>
            피규어의 이미지를 업로드하는 단계입니다. 다음 방법으로 이미지를
            추가할 수 있습니다:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>파일 선택</strong>: &apos;이미지 추가&apos; 버튼을
              클릭하여 컴퓨터에서 이미지 파일을 선택하세요.
            </li>
            <li>
              <strong>드래그 앤 드롭</strong>: 이미지 파일을 드래그하여 업로드
              영역에 놓으세요.
            </li>
            <li>
              <strong>URL 입력</strong>: 외부 이미지 URL을 직접 입력할 수도
              있습니다.
            </li>
          </ul>
          <p>이미지 관리 기능:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>썸네일 설정</strong>: 이미지 위에 마우스를 올리고
              &apos;썸네일로 설정&apos; 버튼을 클릭하세요.
            </li>
            <li>
              <strong>순서 변경</strong>: 이미지 왼쪽의 위/아래 화살표를
              사용하여 이미지 순서를 변경하세요.
            </li>
            <li>
              <strong>이미지 삭제</strong>: 이미지 위에 마우스를 올리고 X 버튼을
              클릭하세요.
            </li>
          </ul>
          <p>최소 한 개 이상의 이미지를 추가해야 합니다.</p>
        </div>
      );
    case "description":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">설명 입력 도움말</h2>
          <p>피규어의 설명과 사양을 입력하는 단계입니다:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>설명</strong>: 피규어의 특징, 배경 스토리, 포즈 등에 대한
              설명을 입력하세요.
            </li>
            <li>
              <strong>사양</strong>: 피규어의 기술적인 사양, 구성품, 특별한 기능
              등을 입력하세요.
            </li>
          </ul>
          <p>이 단계의 모든 필드는 선택 입력 항목입니다.</p>
        </div>
      );
    case "review":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">최종 검토 도움말</h2>
          <p>입력한 모든 정보를 최종 검토하는 단계입니다:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>모든 정보가 정확한지 확인하세요.</li>
            <li>필수 정보가 모두 입력되었는지 확인하세요.</li>
            <li>이미지가 적절하게 업로드되었는지 확인하세요.</li>
            <li>
              모든 내용이 만족스러우면 &apos;등록&apos; 버튼을 클릭하세요.
            </li>
          </ul>
          <p>등록 후에도 언제든지 정보를 수정할 수 있습니다.</p>
        </div>
      );
    default:
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">도움말</h2>
          <p>선택한 항목에 대한 도움말이 없습니다.</p>
        </div>
      );
  }
};
