function Invoke-IncomeLab {
    param([string]$Root)

    Write-Host "=== IncomeLab Start ==="

    & "$Root\core\income_lab\idea_generator.ps1" -OutputPath "$Root\core\income_lab\ideas\ideas.txt"
    Write-Host "Ideas generated."

    $idea = Get-Content "$Root\core\income_lab\ideas\ideas.txt" | Get-Random
    Write-Host "Selected idea: $idea"

    & "$Root\core\income_lab\plan_generator.ps1" -Idea $idea -OutputPath "$Root\core\income_lab\plans\plan.txt"
    Write-Host "Plan created."

    Write-Host "=== IncomeLab End ==="
}
