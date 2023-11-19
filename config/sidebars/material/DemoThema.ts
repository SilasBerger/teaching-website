export const demoThemaSidebar = [{
  type: 'category',
  label: 'Demo Thema',
  items: [
    'DemoThema/Intro',
    {
      type: 'category',
      label: 'Einführung',
      items: [
        'DemoThema/Einfuehrung/Basics',
        'DemoThema/Einfuehrung/HaeufigeFehler',
      ]
    },
    {
      type: 'category',
      label: 'Erstes Subthema',
      items: [
        'DemoThema/ErstesSubthema/Uebersicht',
        {
          type: 'category',
          label: 'Vier Aspekte',
          items: [
            'DemoThema/ErstesSubthema/VierAspekte/ErsterAspekt',
            'DemoThema/ErstesSubthema/VierAspekte/ZweiterAspekt',
            'DemoThema/ErstesSubthema/VierAspekte/DritterAspekt',
            'DemoThema/ErstesSubthema/VierAspekte/VierterAspekt',
          ]
        }
      ]
    }
  ]
}];
