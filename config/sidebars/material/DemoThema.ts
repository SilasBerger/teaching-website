export const demoThemaSidebar = [{
  type: 'category',
  label: 'Demo Thema',
  items: [
    'master/DemoThema/Intro',
    {
      type: 'category',
      label: 'Einführung',
      items: [
        'master/DemoThema/Einfuehrung/Basics',
        'master/DemoThema/Einfuehrung/HaeufigeFehler',
      ]
    },
    {
      type: 'category',
      label: 'Erstes Subthema',
      items: [
        'master/DemoThema/ErstesSubthema/Uebersicht',
        {
          type: 'category',
          label: 'Vier Aspekte',
          items: [
            'master/DemoThema/ErstesSubthema/VierAspekte/ErsterAspekt',
            'master/DemoThema/ErstesSubthema/VierAspekte/ZweiterAspekt',
            'master/DemoThema/ErstesSubthema/VierAspekte/DritterAspekt',
            'master/DemoThema/ErstesSubthema/VierAspekte/VierterAspekt',
          ]
        }
      ]
    }
  ]
}];
