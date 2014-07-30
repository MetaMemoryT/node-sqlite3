var sqlite3 = require('..');
var assert = require('assert');

describe('character tokenizer', function() {
    var db;
    before(function(done) {
        db = new sqlite3.Database(':memory:', done);
    });

    it('should create a new fts4 table with a tokenize=character', function(done) {
        db.loadCharacterTokenizer('',function(err) {
          if (err) throw err;
          db.exec('CREATE VIRTUAL TABLE t1 USING fts4(content TEXT,tokenize=character);', done);
        })
    });
    it('should allow phrase queries to match substrings', function(done) {
      db.run('insert into t1 values ("aaabbbccc")');
      db.run('insert into t1 values ("vvv aaabbbccc")');
      db.run('insert into t1 values ("aaazzzccc")');

      var stmt = db.prepare('select * from t1 where t1 match \"bbb\"');
      stmt.all(function(err,rows) {
        if (err) throw err;
        assert.deepEqual(rows,[{"content":"aaabbbccc"},{"content":"vvv aaabbbccc"}]);
      })

      var stmt = db.prepare('select * from t1 where t1 match \"ccc\"');
      stmt.all(function(err,rows) {
        if (err) throw err;
        assert.deepEqual(rows,[{"content":"aaabbbccc"},{"content":"vvv aaabbbccc"},{"content":"aaazzzccc"}]);
        done();
      })
    })
});
