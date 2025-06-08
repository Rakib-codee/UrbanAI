// This file is a special wrapper that ensures case-insensitive imports work
// It imports the actual Button component and re-exports it
import { Button } from '../Button';

export { Button };
export default Button; 