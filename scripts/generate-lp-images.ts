type ImageSpec = {
  key: string;
  prompt: string;
  model: "recraft-v4-1" | "gpt-2";
  aspectRatio: "16:9";
  approvedCreationId: string;
  approvedUrl: string;
};

type LandingImageSpec = {
  slug: string;
  images: ImageSpec[];
};

export const lpImageSpecs: LandingImageSpec[] = [
  {
    slug: "ear-infections",
    images: [
      {
        key: "hero",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Close-up portrait of a French Bulldog with one ear slightly tilted, looking at camera with curious eyes, soft natural indoor lighting, warm tones, photorealistic, no text, high quality lifestyle photo",
        approvedCreationId: "gJ5J50qSXO",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749323050/render.png?token=exp=1783036800~hmac=c0a73dbee0c08b80f42b5909d2da23b3a0ca16999924d5b5527a58f30f76ee5f",
      },
      {
        key: "problem",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Worried French Bulldog owner woman in her 30s gently checking her Frenchie's ear, concerned expression, cozy home environment, warm candid photography style",
        approvedCreationId: "fFXFXPLCDY",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749323068/render.png?token=exp=1783036800~hmac=2395f16d554e2800088dd8d7f54ab11323d65f6eba95944884ec30038499b152",
      },
      {
        key: "solution",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Smartphone screen showing a clean mobile health tracking app with ear health calendar and streak tracker, floating on soft beige background, product photography style",
        approvedCreationId: "mCDCDJ8hJQ",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749329634/render.png?token=exp=1783036800~hmac=9d318a1b12ff990ef12aa9b32e623071fc0b940ffd3fde6f2fce5582d0d49b28",
      },
      {
        key: "result",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Happy French Bulldog with both ears up and alert, healthy and playful, golden hour light, outdoor garden, lifestyle photography",
        approvedCreationId: "NZSZSvV6D9",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749323394/render.png?token=exp=1783036800~hmac=e4475cb523100269fd536118ed26ad96b4d624d8a3c02cdc1de125f41bf81992",
      },
    ],
  },
  {
    slug: "feeding-guide",
    images: [
      {
        key: "hero",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Overhead flat lay of healthy dog food ingredients for French Bulldog: salmon fillet, turkey, sweet potato, blueberries, fish oil capsules, arranged beautifully on white marble surface, food photography style, warm tones",
        approvedCreationId: "xgQgQCcjfW",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749325730/render.png?token=exp=1783036800~hmac=23bd6dfe2262608bc4c13b5f6cf71d9056a54f23d982d150a74e727cd58c79af",
      },
      {
        key: "problem",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Overwhelmed French Bulldog owner standing in pet store aisle looking at dozens of dog food bags, confused expression, candid photography",
        approvedCreationId: "brvrvmI5Y2",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749325827/render.png?token=exp=1783036800~hmac=b02877f08f1ccb7ae5a897ffa4d94dd62a07f7567f7f72b1a5848bcf7b3ce28b",
      },
      {
        key: "solution",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Happy French Bulldog eating from a clean bowl, healthy shiny coat, bright eyes, cozy kitchen background, lifestyle photography",
        approvedCreationId: "SOKOKKuUb8",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749326002/render.png?token=exp=1783036800~hmac=9b2a7f2371aea5811dba7f7f4a7f403bf6da0d2c793913875838411c8e341310",
      },
      {
        key: "plan",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Clean infographic-style flat lay showing a 3-step elimination diet plan with food items, minimal design, cream and amber colors",
        approvedCreationId: "ONjNjSOynm",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749334766/render.png?token=exp=1783036800~hmac=d15a460c03030ec63b753a1bc658cfd16c99349dab08af0f17e7481232eda2ca",
      },
      {
        key: "result",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Before and after style: French Bulldog with dull coat and red skin vs same breed dog with shiny coat and healthy skin, side by side, clinical but warm photography",
        approvedCreationId: "74r4rSVJAL",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749326811/render.png?token=exp=1783036800~hmac=649f12fc67e6d5f3a33e0ad8969881788b7eed64610808d01e49b7b0a87b48fa",
      },
    ],
  },
  {
    slug: "breathing-heat",
    images: [
      {
        key: "hero",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "French Bulldog resting comfortably in a cool indoor space, fan nearby, looking relaxed and content, soft light, warm home atmosphere, lifestyle photography",
        approvedCreationId: "dIYIWkwXSL",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749329906/render.png?token=exp=1783036800~hmac=f76257900f37e62c904b2b264aca33c86194f619e553479ece1b3d22fa4ff919",
      },
      {
        key: "context",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Anatomical illustration style but warm and friendly: side profile of a French Bulldog showing the flat face and airway, simplified and non-scary, infographic style with cream background and amber accents",
        approvedCreationId: "iAwA78U3uK",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749336797/render.png?token=exp=1783036800~hmac=7c03c5ec44379de4435f0faf1f677002436ab6eda445c5089a2e1952cac50831",
      },
      {
        key: "warning",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "French Bulldog owner outdoors in summer carefully monitoring her dog, protective and caring body language, golden hour photography",
        approvedCreationId: "hEpEewSvqL",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749330015/render.png?token=exp=1783036800~hmac=26c7aaef906cb111218579446e2f44fa8337df6fc251bc51734f90649443debe",
      },
      {
        key: "solution",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Smartphone showing a weather-integrated health alert: 'Temperatura: 28°C — Limitá el ejercicio de [nombre] hoy', clean UI, white background",
        approvedCreationId: "l7b75Tigv9",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749337223/render.png?token=exp=1783036800~hmac=3bf5bfa45132399a59c12ffa34d2cb914ba15eb5129a5b077fc33e79fcb36f10",
      },
      {
        key: "result",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Happy French Bulldog playing indoors safely, energetic but in a controlled cool environment, playful photography",
        approvedCreationId: "74r4xdxJAL",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749330492/render.png?token=exp=1783036800~hmac=b58d1cac0e93f251702f42f7e2560baf26e63ff21b4c8870ab3a6dc15786067a",
      },
    ],
  },
  {
    slug: "new-frenchie-owner",
    images: [
      {
        key: "hero",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "New French Bulldog puppy being held by happy young couple at home, first day, pure joy and slight overwhelm on their faces, warm cozy apartment, lifestyle photography",
        approvedCreationId: "8vTvVnQIrU",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749332710/render.png?token=exp=1783036800~hmac=2c8eb33b088c459e953a6218318cc4a9972c28763ed754caa9a8694bdc30ecbd",
      },
      {
        key: "chaos",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Person on couch surrounded by open tabs on laptop about French Bulldog care, slightly overwhelmed expression, modern home, candid photography",
        approvedCreationId: "xgQgFfYjfW",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749332925/render.png?token=exp=1783036800~hmac=0f96da41afae151cd6708071aa09757f5775ca7225277773936fa302bf6ba55d",
      },
      {
        key: "checklist",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Clean flat lay of French Bulldog puppy essentials: small food bowl, grooming wipe, soft brush, tiny collar, toy, on pastel background, product photography",
        approvedCreationId: "l7b75FFgv9",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749332903/render.png?token=exp=1783036800~hmac=b4aa514aa1b9d691f9920bb899a4ccb77f48bedfe3f98f701cdb651fc86bc8bb",
      },
      {
        key: "community",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Group of diverse French Bulldog owners in a park meeting, all with their Frenchies, laughing and sharing tips, candid social photography",
        approvedCreationId: "MXAXG2XDCm",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749333138/render.png?token=exp=1783036800~hmac=c333bee4eb1387363df0b0f838600830abe62e2f1135d732db59094820734010",
      },
      {
        key: "onboarding",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Smartphone showing a warm onboarding screen: 'Hola mamá de Churro  ¡Bienvenidos!', clean app UI with puppy photo",
        approvedCreationId: "Eqoq8oAuuO",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749344637/render.png?token=exp=1783036800~hmac=468090835a96191a4625369887c6210c0670d42be4d0421c3eaa19a3c634529e",
      },
    ],
  },
  {
    slug: "vet-visits",
    images: [
      {
        key: "hero",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "French Bulldog owner at veterinary clinic looking at her phone showing a detailed health report to the vet, both looking at the screen positively, professional but warm veterinary environment",
        approvedCreationId: "UykyrNqwny",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749335532/render.png?token=exp=1783036800~hmac=d7a4fca6a61f3fb6848a042d7781661f800896bca0d614a75f401c63cec5368d",
      },
      {
        key: "problem",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "French Bulldog owner trying to remember health history, looking up at ceiling thinking, slightly frustrated, in a vet waiting room",
        approvedCreationId: "62U27WRiJO",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749335927/render.png?token=exp=1783036800~hmac=23baffccdc41b15be58e31e5afe173ab3733ab6a8806495192956cf12bfa9671",
      },
      {
        key: "report",
        model: "gpt-2",
        aspectRatio: "16:9",
        prompt:
          "Clean PDF health report document floating on cream background, showing a French Bulldog health timeline with photos, dates and notes, professional document design, warm colors",
        approvedCreationId: "oh0hVQ7829",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749343150/render.png?token=exp=1783036800~hmac=ffd22f4516b21fd8fad91539547220fdc95a4f3192fea7826781f32fec5963da",
      },
      {
        key: "vet",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "Veterinarian looking impressed and pleased at a tablet showing a detailed patient history, approving nod, modern veterinary clinic",
        approvedCreationId: "gJ5JkirSXO",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749336009/render.png?token=exp=1783036800~hmac=a16f5a376c9ce4bea78e5b11702af2d52b4165fbcb7af96de7baab1e67e69247",
      },
      {
        key: "result",
        model: "recraft-v4-1",
        aspectRatio: "16:9",
        prompt:
          "French Bulldog owner leaving vet clinic with her dog, both relaxed and happy, confident expression, sunny day outside the clinic",
        approvedCreationId: "8vTvMb3IrU",
        approvedUrl:
          "https://pikaso.cdnpk.net/private/production/4749336280/render.png?token=exp=1783036800~hmac=53d083429dc8657d6003386fe79482a863b92293fd692f0f3d145019e9c488fe",
      },
    ],
  },
];

export function printMagnificGenerationPlan() {
  for (const page of lpImageSpecs) {
    console.log(`\n${page.slug}`);
    for (const image of page.images) {
      console.log(`- ${image.key}: ${image.model} ${image.aspectRatio}`);
      console.log(`  prompt: ${image.prompt}`);
      console.log(`  approved: ${image.approvedCreationId}`);
    }
  }
}

if (require.main === module) {
  printMagnificGenerationPlan();
}
