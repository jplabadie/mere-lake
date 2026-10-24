.PHONY: check analytics

check:
	node scripts/bedrock.mjs
	node --test scripts/analytics.test.mjs

analytics:
	node scripts/analytics.mjs
