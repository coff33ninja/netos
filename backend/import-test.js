console.log('Starting import test...');

async function testImports() {
    try {
        console.log('Testing sqlite3 import...');
        const sqlite3 = await import('sqlite3');
        console.log('✅ sqlite3 imported successfully');

        console.log('Testing sqlite import...');
        const sqlite = await import('sqlite');
        console.log('✅ sqlite imported successfully');

        console.log('Testing cors import...');
        const cors = await import('cors');
        console.log('✅ cors imported successfully');

        console.log('Testing express import...');
        const express = await import('express');
        console.log('✅ express imported successfully');

        console.log('\nAll imports successful! ✨');
    } catch (error) {
        console.error('❌ Import test failed:', error);
    }
}

testImports().catch(console.error);