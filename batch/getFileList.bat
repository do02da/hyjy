@echo off
setlocal enabledelayedexpansion

set "directory=..\img\gallery"

set "outputFile=fileList.json"

echo [  > %outputFile%

set "firstFile=1"

for %%F in (%directory%\*) do (
    if defined firstFile (
        echo {"name": "%%~nxF"} >> %outputFile%
        set "firstFile="
    ) else (
        echo , {"name": "%%~nxF"} >> %outputFile%
    )
)

echo ] >> %outputFile%

echo "File list has been written to %outputFile%."

endlocal