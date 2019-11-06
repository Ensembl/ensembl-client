if [ -n "$ZSH_VERSION" ]; then
   SOURCE=${(%):-%x}
else
   SOURCE=$BASH_SOURCE
fi

BASE="$(cd "$(dirname "$SOURCE")"; pwd)"

echo "Adding $BASE/bin to path"
export PATH="$BASE/bin:$PATH"

