import {markersFrom} from "./markers";

describe('markersFrom', () => {
  it('returns empty marker list for unmarked filename', () => {
    expect(markersFrom('test.md')).toEqual([]);
  });

  it('returns empty marker list if name does not match pattern', () => {
    expect(markersFrom('test.(marker).md')).toEqual([]);
  });

  it('returns empty marker list for empty marker bracket', () => {
    expect(markersFrom('test.[].md')).toEqual([]);
  });

  it('returns single marker', () => {
    expect(markersFrom('test.[marker].md')).toEqual(['marker']);
  });

  it('returns single marker with special characters', () => {
    expect(markersFrom('test.[a0_b1-c2].md')).toEqual(['a0_b1-c2']);
  });

  it('returns multiple markers', () => {
    expect(markersFrom('test.[marker1,marker2,marker3].md'))
      .toEqual(['marker1', 'marker2', 'marker3']);
  });

  it('returns multiple markers with spaces in filename', () => {
    expect(markersFrom('test.   [marker1, marker2,marker3 ] .md'))
      .toEqual(['marker1', 'marker2', 'marker3']);
  });
});

describe('canonicalNameFrom', () => {

});

describe('hasApplicableMarkers', () => {

});

describe('calculateSpecificity', () => {

});
