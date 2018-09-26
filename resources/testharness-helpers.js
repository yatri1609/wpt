// READ!!! I'm not really sure if this belongs in this directory, or where
// helper functions like this should be placed for external wpt
//
// Helper functions for writing webplatform tests

/**
 * Ensures that indexeddb database specified by db_name is deleted, and then
 * opens a connection to that database.
 *
 * @param t: the testing script state
 * @param db_name: name of database to delete then create
 * @param upgrade_func: function to be called if db_name needs upgrading
 * @param body_func: function to be called upon successful deletion
 *    and creation of db_name
 */
function delete_then_open(t, db_name, upgrade_func, body_func) {
  var delete_request = indexedDB.deleteDatabase(db_name);
  delete_request.onerror = t.unreached_func('deleteDatabase should not fail');
  delete_request.onsuccess = t.step_func(function(e) {
    var open_request = indexedDB.open(db_name);
    open_request.onupgradeneeded = t.step_func(function() {
      upgrade_func(t, open_request.result, open_request);
    });
    open_request.onsuccess = t.step_func(function() {
      body_func(t, open_request.result);
    });
  });
}

/**
 * Creates a barrier that one calls
 *
 * @param callback: function to be called after barrier is passed
 */
function create_barrier(callback) {
  var count = 0;
  var called = false;
  return function(t) {
    assert_false(called, "Barrier already used.");
    ++count;
    return t.step_func(function() {
      --count;
      if (count === 0) {
        assert_false(called, "Barrier already used.");
        called = true;
        callback();
      }
    });
  }
}
