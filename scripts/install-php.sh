#!/usr/bin/env bash
# Install an isolated PHP CLI without changing system files (Debian 13 cloud image).
set -euo pipefail
tools_root=/workspace/.tools
if [ -x "$tools_root/php/usr/bin/php8.4" ] && [ -x /workspace/bin/php ]; then
  LD_LIBRARY_PATH="$tools_root/php/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" "$tools_root/php/usr/bin/php8.4" -n --version
  exit 0
fi
mkdir -p "$tools_root/apt/lists/partial" "$tools_root/apt/cache/archives/partial" "$tools_root/apt/packages" "$tools_root/apt/conf.d" "$tools_root/apt/sourceparts" "$tools_root/php" /workspace/bin
touch "$tools_root/apt/empty.conf"
cat > "$tools_root/apt/sources.list" <<'SOURCES'
deb [signed-by=/usr/share/keyrings/debian-archive-keyring.gpg] https://deb.debian.org/debian trixie main
SOURCES
cat > "$tools_root/apt/apt.conf" <<'CONFIG'
Dir::Etc::Parts "/workspace/.tools/apt/conf.d";
Dir::Etc::main "/workspace/.tools/apt/empty.conf";
Dir::Etc::sourcelist "/workspace/.tools/apt/sources.list";
Dir::Etc::sourceparts "/workspace/.tools/apt/sourceparts";
Dir::State::lists "/workspace/.tools/apt/lists";
Dir::Cache "/workspace/.tools/apt/cache";
Dir::Cache::archives "/workspace/.tools/apt/cache/archives";
APT::Sandbox::User "agent";
CONFIG
export APT_CONFIG="$tools_root/apt/apt.conf"
/usr/bin/apt-get update
cd "$tools_root/apt/packages"
/usr/bin/apt-get download php8.4-cli php8.4-common libargon2-1
for package in ./*.deb; do dpkg-deb -x "$package" "$tools_root/php"; done
cat > /workspace/bin/php <<'WRAPPER'
#!/usr/bin/env bash
export LD_LIBRARY_PATH="/workspace/.tools/php/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
exec /workspace/.tools/php/usr/bin/php8.4 -n "$@"
WRAPPER
chmod +x /workspace/bin/php
/workspace/bin/php --version
