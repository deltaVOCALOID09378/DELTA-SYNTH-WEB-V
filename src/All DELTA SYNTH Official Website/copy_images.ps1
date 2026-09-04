$vb_chars = @("Ahctan", "Arun Kamonlanetr", "Ayanami Hikaru", "Ayanami Kyoko", "Azaya Aika", "Chansamorn", "Diwachi", "Dokya", "FangYu", "FellowWhite", "Fuwari Bento", "Guren Kani", "Helen", "KangFu", "Kochujang", "Mairu Maishi", "Mayuree", "Miro", "Namphueng", "Narisa", "Onika", "Root", "SRIPHAN", "SUN", "Sakultala", "Savanna", "Thitiya Anantanetr", "Tom", "Yamada Takeshi")
$collab_chars = @("Felix", "MochiAI", "Quint")

$base_dir = "e:\All DELTA SYNTH Official Website"
$src_dir = Join-Path $base_dir "src"
$vb_img_dir = Join-Path $src_dir "assets\images\voicebanks"
$collab_img_dir = Join-Path $src_dir "assets\images\collabs"

New-Item -ItemType Directory -Force -Path $vb_img_dir | Out-Null
New-Item -ItemType Directory -Force -Path $collab_img_dir | Out-Null

$vb_src_img_dir = Join-Path $base_dir "3._All Voicebank _ DELTA SYNTH_files"
$collab_src_img_dir = Join-Path $base_dir "5._All Callaboraion Voicebank. _ deltasynthstudio_files"

foreach ($char in $vb_chars) {
    $src = Join-Path $vb_src_img_dir "$char.png"
    $dest = Join-Path $vb_img_dir "$char.png"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dest -Force
    }
}

foreach ($char in $collab_chars) {
    $src = Join-Path $collab_src_img_dir "$char.png"
    $dest = Join-Path $collab_img_dir "$char.png"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dest -Force
    }
}
