#!/bin/bash

echo "Fixing import statements for UI components..."

# Fix imports for UI components
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/button" | xargs sed -i '' 's|@/components/ui/button|@/components/ui/Button|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/input" | xargs sed -i '' 's|@/components/ui/input|@/components/ui/Input|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/label" | xargs sed -i '' 's|@/components/ui/label|@/components/ui/Label|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/textarea" | xargs sed -i '' 's|@/components/ui/textarea|@/components/ui/Textarea|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/card" | xargs sed -i '' 's|@/components/ui/card|@/components/ui/Card|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/tabs" | xargs sed -i '' 's|@/components/ui/tabs|@/components/ui/Tabs|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/switch" | xargs sed -i '' 's|@/components/ui/switch|@/components/ui/Switch|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/slider" | xargs sed -i '' 's|@/components/ui/slider|@/components/ui/Slider|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/avatar" | xargs sed -i '' 's|@/components/ui/avatar|@/components/ui/Avatar|g'
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/ui/dropdown-menu" | xargs sed -i '' 's|@/components/ui/dropdown-menu|@/components/ui/DropdownMenu|g'

# Fix imports for charts
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*from.*@/components/dashboard/charts/areaChart" | xargs sed -i '' 's|@/components/dashboard/charts/areaChart|@/components/dashboard/charts/AreaChart|g'

echo "Import statements fixed!" 