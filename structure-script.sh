#!/bin/bash
bash_script_absolute_path=$(pwd)

declare public_paths=("public" "public/assets" "public/assets/images")
declare source_paths=("src" "src/lib" "src/scripts" "src/scripts/background" "src/scripts/content" "src/scripts/injected" "src/scripts/popup" "src/styles")
declare public_directory_path="public"
declare manifest_file="manifest.json"
declare project_name="note-me"

create_directory () {
    if [ ! -d "$1" ]; then
        mkdir ${1}
    fi
}

create_file () {
    if [ ! -e "$2/$1" ]; then
        touch $2/$1
    fi
}

create_public_directories () {
    for public_path in "${public_paths[@]}";
    do
        create_directory $public_path
    done
}

create_source_directories () {
    for source_path in "${source_paths[@]}";
    do
        create_directory $source_path
    done
}

execute () {
    echo "creating project struture at "${bash_script_absolute_path}
    create_directory $project_name
    cd $bash_script_absolute_path"/"$project_name
    create_public_directories
    create_source_directories
    create_file $manifest_file $public_directory_path
    echo "done creating project struture at "${bash_script_absolute_path}" with project name "$project_name
}

execute