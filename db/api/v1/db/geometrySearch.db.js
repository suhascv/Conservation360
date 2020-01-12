/**
 * Finds assets that are geospacially related.
 */

// Limit on how many rows may be returned on a find
const QUERY_LIMIT = 50;

/**
 * Finds assets within a rectangular area. The parameters are 
 * xmin, ymin, xmax, ymax where x is the latitude of the asset and  
 * y is the longitude of the asset.
 */
const ENVELOPE_FIND = `
    SELECT
        a.id,
        s.name AS sponsor_name,
        p.name AS project_name,
        at.name AS asset_type,
        at.description AS asset_description,
        ST_X(a.location) AS lat,
        ST_Y(a.location) AS lon
    FROM
        asset a
        JOIN project p ON a.project_id = p.id
        JOIN sponsor s ON p.sponsor_id = s.id
        JOIN asset_type at ON a.asset_type_id = at.id
    WHERE
        ST_Within(a.location, ST_MakeEnvelope(%1, %2, %3, %4))
    LIMIT
        %5;
`;

/**
 * Finds assets within a rectangular area using the bottom left and top
 * right points of the rectangle.
 * 
 * @param {*} latMin - the minimum latitude (x coordinate) of the bounding box
 * @param {*} lonMin - the minimum longitude (y coordinate) of the bounding box
 * @param {*} latMax - the maximum latitude of the bounding box
 * @param {*} lonMax - the maximum latitude of the bounding box
 */
const envelopeFind = async (latMin, lonMin, latMax, lonMax) => {
    const params = [latMin, lonMin, latMax, lonMax, QUERY_LIMIT];
    const result = await global.dbPool.query(ENVELOPE_FIND, params);
    return result.rows;
};

module.exports = {
    envelopeFind
};
