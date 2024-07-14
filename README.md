<p align="center">
    <a href="https://www.chalkysticks.com" target="_blank" rel="noopener noreferrer">
        <img width="600" src="./assets/header.png" alt="ChalkySticks logo" />
    </a>
</p>

<br/>

<p align="center">
    <a href="https://github.com/chalkysticks/vue2-components" title="GitHub version">
        <img src="https://img.shields.io/badge/version-v1.0.0-blue.svg" alt="v1.0.0" />
    </a>
    <a href="https://www.patreon.com/mattkenefick" title="Backers on Patreon">
        <img src="https://img.shields.io/badge/backer-Patreon-orange.svg" alt="v1.0.0" />
    </a>
    <a href="https://paypal.me/polymermallard" title="Backers on Paypal">
        <img src="https://img.shields.io/badge/backer-Paypal-blue.svg" alt="v1.0.0" />
    </a>
</p>

<br/>

## 🎱 Vue2.x Components

> ChalkySticks themed components for Vue2.x / TypeScript platforms

## Installation

Open your terminal and type in

```sh
$ yarn add chalkysticks/vue2-components
```

Use them in your Vue2.x project by importing them

```typescript
import ChalkySticks from '@chalkysticks/vue2-components';

Vue.use(ChalkySticks, {
	api_url: 'http://localhost:3333',
});
```

We can also load individual assets:

```typescript
import { AuthenticationAuthPanel, BrandingBadge, ..., ViewBase } from '@chalkysticks/vue2-components';
```

The Vue assets are devDependencies because loading them as regular dependencies
will cause Vue to load twice, which throws `readonly $attrs` errors.

## Components

Components are automatically registered with the `Chalky` prefix like this:

```
<ChalkyBrandingBadge size="sm" mode="dark" />
<ChalkyBrandingBadge size="sm" mode="light" />
<ChalkyBrandingStandard class="background-chalky-blue p-3" mode="dark" />
<ChalkyTvVideoTheater ref="videoTheater" channel="billiards" />
```

They can also be imported without the prefix from the `@chalkysticks/vue2-components` package as seen above.

### BrandingBadge

Lorem ipsum dolor ist amet...

<img width="180" src="./assets/branding-badge.png" alt="BrandingBadge" />

```javascript
import { BrandingBadge } from '@chalkysticks/vue2-components';
```

```html
<div>
	<ChalkyBrandingBadge size="sm" mode="dark" />
	<ChalkyBrandingBadge size="sm" mode="light" />
</div>
<div>
	<ChalkyBrandingBadge mode="dark" />
	<ChalkyBrandingBadge mode="light" />
</div>
<div>
	<ChalkyBrandingBadge size="lg" mode="dark" />
	<ChalkyBrandingBadge size="lg" mode="light" />
</div>
```

### BrandingStandard

Lorem ipsum dolor ist amet...

<img height="70" src="./assets/branding-standard.png" alt="BrandingBadge" />

```javascript
import { BrandingStandard } from '@chalkysticks/vue2-components';
```

```html
<div class="d-flex">
	<ChalkyBrandingStandard class="background-chalky-white p-3" mode="dark" />
	<ChalkyBrandingStandard class="background-chalky-blue p-3" mode="light" />
</div>
```

## Bugs

If you have questions, feature requests or a bug you want to report, please click [here](https://github.com/chalkysticks/vue2-components/issues) to file an issue.

## Troubleshooting

It's important that we set `useDefineForClassFields` to `false` in `tsconfig.json` due to
a breaking change. If it's set to true, then the decorators like `@Prop` will not be
effective.

## Support

Like what you see? Keep me awake at night by buying me a coffee or two.

<a href="https://www.patreon.com/mattkenefick" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="37" alt="Become a patreon" style="height: auto !important;width: auto !important;">
</a>

## License

Copyright (c) 2021 Matt Kenefick.

Usage is provided under the MIT License. See [LICENSE](https://github.com/mattkenefick/eloquentjs/blob/master/LICENSE) for the full details.
