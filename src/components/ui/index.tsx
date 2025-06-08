/**
 * This file provides a single import point for all UI components
 * with fallbacks in case any component can't be found
 */

import React from 'react';
import { FallbackComponent } from './FallbackComponent';

// Import all UI components with try/catch for reliability
let Button, Input, Label, Textarea, Card, Tabs, Switch, Slider, Avatar;

// Button
try {
  Button = require('./Button').Button;
} catch (e) {
  console.warn('Failed to load Button component, using fallback');
  Button = (props: any) => <FallbackComponent componentName="Button" {...props} />;
}

// Input
try {
  Input = require('./Input').Input;
} catch (e) {
  console.warn('Failed to load Input component, using fallback');
  Input = (props: any) => <FallbackComponent componentName="Input" {...props} />;
}

// Label
try {
  Label = require('./Label').Label;
} catch (e) {
  console.warn('Failed to load Label component, using fallback');
  Label = (props: any) => <FallbackComponent componentName="Label" {...props} />;
}

// Textarea
try {
  Textarea = require('./Textarea').Textarea;
} catch (e) {
  console.warn('Failed to load Textarea component, using fallback');
  Textarea = (props: any) => <FallbackComponent componentName="Textarea" {...props} />;
}

// Card
try {
  const CardModule = require('./Card');
  Card = CardModule.Card;
  export const { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } = CardModule;
} catch (e) {
  console.warn('Failed to load Card components, using fallbacks');
  Card = (props: any) => <FallbackComponent componentName="Card" {...props} />;
  export const CardContent = (props: any) => <FallbackComponent componentName="CardContent" {...props} />;
  export const CardDescription = (props: any) => <FallbackComponent componentName="CardDescription" {...props} />;
  export const CardFooter = (props: any) => <FallbackComponent componentName="CardFooter" {...props} />;
  export const CardHeader = (props: any) => <FallbackComponent componentName="CardHeader" {...props} />;
  export const CardTitle = (props: any) => <FallbackComponent componentName="CardTitle" {...props} />;
}

// Export all components
export { Button, Input, Label, Textarea, Card, FallbackComponent }; 