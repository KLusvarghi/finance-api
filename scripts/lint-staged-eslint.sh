#!/bin/bash
# Script to run ESLint on staged files in the correct workspace directory

set -e

# Get the absolute path to the monorepo root
MONOREPO_ROOT=$(git rev-parse --show-toplevel)

# Target workspace
WORKSPACE="apps/api"

# Change to the workspace directory
cd "$MONOREPO_ROOT/$WORKSPACE" || exit 1

# Process all files to make them relative to workspace
FILES=()
for file in "$@"; do
    # Convert to absolute path if needed
    if [[ "$file" != /* ]]; then
        file="$MONOREPO_ROOT/$file"
    fi

    # Get path relative to monorepo root
    REL_PATH="${file#$MONOREPO_ROOT/}"

    # Only process files that belong to this workspace
    if [[ "$REL_PATH" == "$WORKSPACE/"* ]]; then
        # Remove workspace prefix to get path relative to workspace
        FILE_PATH="${REL_PATH#$WORKSPACE/}"
        FILES+=("$FILE_PATH")
    fi
done

# Only run ESLint if we have files to lint
if [ ${#FILES[@]} -gt 0 ]; then
    npx eslint --fix "${FILES[@]}"
fi
