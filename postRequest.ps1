# JSON 데이터 정의
$body = @{
    key = 'value'
} | ConvertTo-Json

# Headers 설정
$headers = @{
    "Content-Type" = "application/json"
}

# POST 요청 보내기
$response = Invoke-WebRequest -Uri "https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/wordTest.html?id=JeongA/saveResults" -Method POST -Body $body -Headers $headers -ContentType "application/json"

# 응답 출력
Write-Output $response.Content
