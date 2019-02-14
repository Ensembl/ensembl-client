pub fn truncate(s: &str, max_chars: usize) -> &str {
    let delta = s.len() - max_chars;
    if delta > 0 {
        match s.char_indices().nth(delta) {
            None => s,
            Some((idx, _)) => &s[idx..],
        }
    } else {
        s
    }
}
