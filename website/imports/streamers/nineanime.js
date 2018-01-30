function cleanName(name) {
  return name.replace(/\s\(Dub\)$/, '').replace(/\s\(Sub\)$/, '');
}

function getTypeFromName(name) {
  return name.endsWith(' (Dub)') ? 'dub' : 'sub';
}

export let nineanime = {
  // General data
  id: 'nineanime',
  name: '9anime',
  homepage: 'https://9anime.ch',

  isInvalidPage(page) {
    return false;
  },

  // Search page data
  search: {
    createUrl: function(query) {
      return nineanime.homepage + '/search?keyword=' + encodeURIComponentReplaceSpaces(query, '+');
    },
    rowSelector: 'div.film-list div.item',
    rowSkips: 0,

    // Search page attribute data
    attributes: {
      streamerUrls: function(partial) {
        return [{
          type: getTypeFromName(partial.find('a.name').text()),
          url: partial.find('a.name').attr('href')
        }];
      },
      name: function(partial) {
        return cleanName(partial.find('a.name').text());
      },
      type: function(partial) {
        let types = ['OVA', 'Movie', 'Special', 'ONA'];
        let found = undefined;

        partial.find('a.poster div.status div').each((index, element) => {
          if (!found && types.includes(partial.find(element).text())) {
            found = partial.find(element).text();
          }
        });

        return found;
      },
    },
  },

  // Show page data
  show: {
    checkIfPage: function (page) {
      return page('title').text().cleanWhitespace().match(/^Watch .* on 9anime.to$/);
    },

    // Show page attribute data
    attributes: {
      streamerUrls: function(partial) {
        return [{
          type: getTypeFromName(partial.find('div.widget.player div.widget-title h1.title').text()),
          url: partial.find('head link').attr('href')
        }];
      },
      name: function(partial) {
        return cleanName(partial.find('div.widget.player div.widget-title h1.title').text());
      },
      altNames: function(partial) {
        return partial.find('div.info div.head div.c1 p.alias').text().split('; ');
      },
      description: function(partial) {
        return partial.find('div.info div.desc').text()
      },
      type: function(partial) {
        return partial.find('div.info div.row dl.meta dd:first-of-type').text().split(' ')[0]
      },
    },
  },

  // Related shows data
  showRelated: {
    rowSelector: 'div.widget.simple-film-list div.widget-body div.item',
    rowIgnore: function(partial) {
      return false;
    },

    // Related shows attribute data
    attributes: {
      streamerUrls: function(partial) {
        return [{
          type: getTypeFromName(partial.find('div.info a.name').text()),
          url: partial.find('div.info a.name').attr('href')
        }];
      },
      name: function(partial) {
        return cleanName(partial.find('div.info a.name').text());
      },
    },
  },

  // Episode list data
  showEpisodes: {
    rowSelector: 'div.widget.servers div.widget-body div.server.active ul li a',
    rowSkips: 0,
    cannotCount: false,

    // Episode list attribute data
    attributes: {
      episodeNum: function(partial) {
        return partial.text()
      },
      sourceUrl: function(partial) {
        return nineanime.homepage + partial.attr('href');
      },
    },
  },

  // Episode page data
  episode: {
    requiresDownload: false,

    getSources: function(sourceUrl) {

    },
  },
};