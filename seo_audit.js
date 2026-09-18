const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf-8');

console.log('--- VISHVAX SEO AUDIT REPORT ---');

// 1. Title Check
const titleMatch = content.match(/<title>(.*?)<\/title>/i);
console.log('1. Title:', titleMatch ? titleMatch[1] : 'MISSING');

// 2. Meta Description Check
const metaDescMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/i);
console.log('2. Meta Description:', metaDescMatch ? metaDescMatch[1] : 'MISSING');

// 3. Canonical Check
const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="(.*?)"/i);
console.log('3. Canonical URL:', canonicalMatch ? canonicalMatch[1] : 'MISSING');

// 4. Robots Check
const robotsMatch = content.match(/<meta\s+name="robots"\s+content="(.*?)"/i);
console.log('4. Robots Meta:', robotsMatch ? robotsMatch[1] : 'MISSING');

// 5. Google Search Console Placeholder Check
const gscMatch = content.match(/<meta\s+name="google-site-verification"\s+content="(.*?)"/i);
console.log('5. Google Site Verification Tag:', gscMatch ? gscMatch[1] : 'MISSING');

// 6. H1 Count
const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
console.log(`6. H1 Count: ${h1Matches.length}`);
if (h1Matches.length > 0) {
  const h1Text = h1Matches[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`   H1 Text: "${h1Text}"`);
}

// 7. JSON-LD Verification
const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    console.log('7. JSON-LD Schema: VALID JSON! Entities found:');
    parsed['@graph'].forEach((node, idx) => {
      console.log(`   [${idx + 1}] Type: ${node['@type']}, ID: ${node['@id'] || 'N/A'}`);
    });
  } catch (err) {
    console.error('7. JSON-LD Schema ERROR:', err.message);
  }
} else {
  console.log('7. JSON-LD Schema: MISSING');
}

// 8. Brand Name Verification (check for erroneous "Vishva X" or "Vishvax")
const badMatches = content.match(/(Vishva\s+X|Vishva-X)/g) || [];
console.log(`8. Spurious Brand Variations ("Vishva X"): ${badMatches.length}`);

// 9. Files Existence
console.log('9. robots.txt exists:', fs.existsSync(path.join(__dirname, 'robots.txt')));
console.log('   sitemap.xml exists:', fs.existsSync(path.join(__dirname, 'sitemap.xml')));
console.log('   vishvax-logo.png exists:', fs.existsSync(path.join(__dirname, 'vishvax-logo.png')));

console.log('--- AUDIT COMPLETE ---');
