let config = {
  salt:'appservercool',
  announce_url: 'https://cybex.zendesk.com/api/v2/help_center/<%= lang %>/articles.json?sort_by=created_at&per_page=6',
  cache_time:10
}
module.exports = config