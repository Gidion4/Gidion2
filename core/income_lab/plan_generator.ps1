function Invoke-IncomePlanGenerator {
    param(
        [string]$Idea,
        [string]$OutputPath
    )

    $plan = @"
Idea: $Idea

1. Kohdeyleisö
2. Tuotteen muoto
3. Sisältörakenne
4. Markkinointikanavat
5. Myyntimateriaali
6. Skaalausvaiheet
7. Aikataulu
"@

    $plan | Set-Content -Path $OutputPath -Encoding UTF8
}
