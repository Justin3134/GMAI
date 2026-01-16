// Quick API Test Script
require('dotenv').config();
const {
    generateStory
} = require('./agents/storyAgent');
const {
    textToSpeech
} = require('./services/elevenlabs');
const {
    generateSceneImage
} = require('./services/freepik');

async function testAPIs() {
    console.log('🧪 Testing API Integrations...\n');

    // Test Anthropic (Story Generation)
    console.log('1️⃣ Testing Anthropic (Story Agent)...');
    try {
        const story = await generateStory(
            'Start adventure for Emma the Wizard', {
                location: 'village'
            },
            'A magical village'
        );
        console.log('✅ Anthropic working!');
        console.log('Story preview:', story.substring(0, 80) + '...\n');
    } catch (error) {
        console.log('❌ Anthropic failed:', error.message);
        console.log('Check ANTHROPIC_API_KEY in .env\n');
    }

    // Test ElevenLabs (Voice)
    console.log('2️⃣ Testing ElevenLabs (Voice)...');
    try {
        const audio = await textToSpeech('Hello, this is a test.', 'narrator');
        if (audio && audio.startsWith('data:audio/mpeg')) {
            console.log('✅ ElevenLabs working!');
            console.log('Audio generated successfully\n');
        } else {
            console.log('⚠️ ElevenLabs returned null (check API key)\n');
        }
    } catch (error) {
        console.log('❌ ElevenLabs failed:', error.message);
        console.log('Check ELEVENLABS_API_KEY in .env\n');
    }

    // Test Freepik (Images)
    console.log('3️⃣ Testing Freepik (Images)...');
    try {
        const imageUrl = await generateSceneImage('A magical village with a wizard');
        if (imageUrl) {
            console.log('✅ Freepik working!');
            console.log('Image URL:', imageUrl.substring(0, 60) + '...\n');
        } else {
            console.log('⚠️ Freepik returned null (check API key)\n');
        }
    } catch (error) {
        console.log('❌ Freepik failed:', error.message);
        console.log('Check FREEPIK_API_KEY in .env\n');
    }

    console.log('🎉 API Test Complete!\n');
    console.log('Note: Optional APIs (Senso, Macroscope, Modulate, Tonic) have fallbacks');
    process.exit(0);
}

testAPIs();