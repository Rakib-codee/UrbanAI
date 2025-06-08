#!/bin/bash

# Fix case sensitivity issues for all UI components
echo "Fixing case sensitivity issues for UI components..."

# Create a temp directory
mkdir -p src/components/ui/temp

# Copy files with capitalized names
echo "Copying UI components with proper capitalization..."
for file in avatar button card input label textarea tabs switch slider dropdown-menu; do
  if [ -f "src/components/ui/${file}.tsx" ]; then
    cp "src/components/ui/${file}.tsx" "src/components/ui/temp/$(tr '[:lower:]' '[:upper:]' <<< ${file:0:1})${file:1}.tsx"
  fi
done

# Remove original files
echo "Removing original lowercase files..."
for file in avatar button card input label textarea tabs switch slider dropdown-menu; do
  if [ -f "src/components/ui/${file}.tsx" ]; then
    rm "src/components/ui/${file}.tsx"
  fi
done

# Move capitalized files back
echo "Moving capitalized files back..."
for file in Avatar Button Card Input Label Textarea Tabs Switch Slider DropdownMenu; do
  if [ -f "src/components/ui/temp/${file}.tsx" ]; then
    mv "src/components/ui/temp/${file}.tsx" "src/components/ui/"
  fi
done

# Remove temp directory
rm -rf src/components/ui/temp

# Fix case sensitivity issues for chart components
echo "Fixing case sensitivity for chart components..."
mkdir -p src/components/dashboard/charts/temp

for file in areaChart; do
  if [ -f "src/components/dashboard/charts/${file}.tsx" ]; then
    cp "src/components/dashboard/charts/${file}.tsx" "src/components/dashboard/charts/temp/$(tr '[:lower:]' '[:upper:]' <<< ${file:0:1})${file:1}.tsx"
  fi
done

for file in areaChart; do
  if [ -f "src/components/dashboard/charts/${file}.tsx" ]; then
    rm "src/components/dashboard/charts/${file}.tsx"
  fi
done

for file in AreaChart; do
  if [ -f "src/components/dashboard/charts/temp/${file}.tsx" ]; then
    mv "src/components/dashboard/charts/temp/${file}.tsx" "src/components/dashboard/charts/"
  fi
done

rm -rf src/components/dashboard/charts/temp

echo "Case sensitivity issues fixed!" 