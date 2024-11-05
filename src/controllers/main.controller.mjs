export const mainView = (req, res) => {
    let data = {
        title: 'Panel administración'
    };
    res.render('pages/main_page', { layout: 'layouts/main_layout', data });
};
