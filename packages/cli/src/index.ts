import '@designtoken/dtcg-spec-2025-06-02-format';
import '@designtoken/dtcg-spec-2025-06-28-color';
import { registry } from '@designtoken/core';

console.log(registry.get('format', '2025-06-02'));
console.log(registry.get('color', '2025-06-28'));